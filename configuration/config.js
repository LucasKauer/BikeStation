module.exports = {
	"facebook_api_key"	  : process.env.APP_KEY || "",
	"facebook_api_secret" : process.env.APP_SECRET || "",
	"callback_url"		  : process.env.APP_URL + "auth/facebook/callback" || "http://localhost:3000/auth/facebook/callback",
	"use_database"		  : "false",
	"host"				  : "localhost",
	"username"			  : "root",
	"password"			  : "",
	"database"			  : ""
}
