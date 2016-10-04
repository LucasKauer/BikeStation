module.exports = {
<<<<<<< HEAD
	"facebook_api_key"	  : "202459236832145",
	"facebook_api_secret" : "937cc6e7849cb5ebacea01ac54210b8f",
	"callback_url"		  : "http://localhost:3000/auth/facebook/callback",
=======
	"facebook_api_key"	  : process.env.APP_KEY || "",
	"facebook_api_secret" : process.env.APP_SECRET || "",
	"callback_url"		  : process.env.APP_URL || "http://localhost:3000/auth/facebook/callback",
>>>>>>> 406b1bcba5230a41614d5c4287822db996a4d2e2
	"use_database"		  : "false",
	"host"				  : "localhost",
	"username"			  : "root",
	"password"			  : "",
	"database"			  : ""
}
