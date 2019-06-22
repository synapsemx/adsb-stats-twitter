# Overview

We have a PiAware device capturing ADS-B transmissions from aircraft flying overhead. It reports that data to FlightAware, who have a very nice UI but no API to retrieve your own data back.

This is a simple node app that pulls data back down (via a provided station id) then tweets some basic stats about what you observed yesterday.

# Installation

```
yarn
```

# Configuration

Pretty basic. Create a `.env` file with the following contents

```
STATION_ID=12345
CONSUMER_KEY=YourKeyHere
CONSUMER_SECRET=YourSecretHere
ACCESS_TOKEN_KEY=YourTokenHere
ACCESS_TOKEN_SECRET=YourTokenSecretHere
```

The `STATION_ID` field is the *site* on your ADS-B status page - flightaware.com/adsb/stats/user/_yourUserName_

You need valid Twitter developer credentials in the form of a set of consumer and access tokens/keys. You can get these [here](https://apps.twitter.com/). Do not forgot to adjust your permissions - most POST request require write permissions. 

If you don't want to post to Twitter (why are you using this??) then you can omit these.

# Running

To run it in a test mode, just call it directly:

```
node .
```

or 

```
yarn start
```

To run it in a live mode (so it posts to Twitter), add an environment flag:

```
RUN_MODE=live node .
```

You could also put it in the `.env` file if you just always want it to send a tweet. 
