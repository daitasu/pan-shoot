package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"golang.org/x/oauth2"
	"google.golang.org/api/people/v1"
)


type UserProfile struct {
	Email      string `json:"email"`
	Name       string `json:"name"`
	Id         string `json:"id"`
	PictureUrl string `json:"picture"`
}

func LoginHandler(googleOauthConfig *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		url := googleOauthConfig.AuthCodeURL("state")
		http.Redirect(w, r, url, http.StatusTemporaryRedirect)
	}
}

func FakeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Fake API")
}

func GoogleCallbackHandler(googleOauthConfig *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
}

func GetUserInfoHandler(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*people.Person)
	log.Println(user)
	var userProfile UserProfile

	for _, name := range user.Names {
		userProfile.Name = name.DisplayName
		break
	}
	for _, email := range user.EmailAddresses {
		userProfile.Email = email.Value
		break
	}
	for _, photo := range user.Photos {
		userProfile.PictureUrl = photo.Url
		break
	}
	userProfile.Id = user.ResourceName[7:]

	// Return the user's profile information in the response
	json.NewEncoder(w).Encode(userProfile)
}
