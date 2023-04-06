package middleware

import (
	"context"
	"net/http"
	"strings"

	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/people/v1"
)

func isGoogleAuthError(err error) bool {
	return strings.HasPrefix(err.Error(), "googleapi: Error 401:")
}

func AuthMiddleware(next http.Handler, googleOauthConfig *oauth2.Config) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

		person, err := service.People.Get("people/me").PersonFields("names,emailAddresses,photos").Do()
		if err != nil {
			var statusCode int

			if isGoogleAuthError(err) {
				statusCode = http.StatusUnauthorized
			} else {
				statusCode = http.StatusInternalServerError
			}
			http.Error(w, err.Error(), statusCode)
			return
		}

		// Store the user's information in the request context
		ctx := context.WithValue(r.Context(), "user", person)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}