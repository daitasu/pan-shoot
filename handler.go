package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/people/v1"
)


type UserProfile struct {
	Email      string `json:"email"`
	Name       string `json:"name"`
	Id         string `json:"id"`
	PictureUrl string `json:"picture"`
}

var (
	googleOauthConfig *oauth2.Config
)

func init() {
	err := godotenv.Load()
	if err != nil {
		 log.Fatal("Error loading .env file")
	}

	ClientID := os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
	ClientSecret := os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET")
	RedirectURL := os.Getenv("GOOGLE_OAUTH_REDIRECT_URL")
	
	googleOauthConfig = &oauth2.Config{
		ClientID:     ClientID,
		ClientSecret: ClientSecret,
		RedirectURL:  RedirectURL,
		Scopes: []string{
			people.UserinfoEmailScope,
			people.UserinfoProfileScope,
		},
		Endpoint: google.Endpoint,
	}
}

func isGoogleAuthError(err error) bool {
	return strings.HasPrefix(err.Error(), "googleapi: Error 401:")
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	url := googleOauthConfig.AuthCodeURL("state")
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func fakeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Fake API")
}

func googleCallbackHandler(w http.ResponseWriter, r *http.Request) {
	code := r.FormValue("code")
	token, err := googleOauthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}
	// Create a new cookie containing the access token.
	expiration := time.Now().Add(24 * time.Hour)
	cookie := http.Cookie{
		Name:     "access_token",
		Value:    token.AccessToken,
		Expires:  expiration,
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(w, &cookie)

	// Redirect the user to the homepage.
	http.Redirect(w, r, "/?scene=mypage", http.StatusSeeOther)
}

func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("access_token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	token := &oauth2.Token{
		AccessToken: cookie.Value,
	}
	client := googleOauthConfig.Client(context.Background(), token)

	// Call the People API to retrieve the user's information
	service, err := people.NewService(context.Background(), option.WithHTTPClient(client))
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	person, err := service.People.Get("people/me").
		PersonFields("names,emailAddresses,photos").
		Do()

		if err != nil {
		var statusCode int

		if(isGoogleAuthError(err)) {
			statusCode = http.StatusUnauthorized
		} else {
			statusCode = http.StatusInternalServerError
		}
		http.Error(w, err.Error(), statusCode)
		return
	}

	var userProfile UserProfile

	for _, name := range person.Names {
		userProfile.Name = name.DisplayName
		break
	}
	for _, email := range person.EmailAddresses {
		userProfile.Email = email.Value
		break
	}
	for _, photo := range person.Photos {
		userProfile.PictureUrl = photo.Url
		break
	}
	userProfile.Id = person.ResourceName[7:]

	// Return the user's profile information in the response
	json.NewEncoder(w).Encode(userProfile)
}