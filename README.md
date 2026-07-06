# Timer

<img src="public/favicon.svg" alt="Timer" width="100"/>

## Description

This is a simple timer application that allows users to run multiple timers.
This application is optimized for use on iOS Safari, ensuring the best performance and user experience on Apple devices.

## Features

- Start, pause, and reset timers.
- Audio feedback for timer events.
- Persistent storage of timers using local storage.
- Support for loading timers from a remote JSON file.
- Upload completed workouts to Strava as manual activities.

## Workout format

```json
{
  "name": "Yoga",
  "sport": "Yoga",
  "timers": [{ "id": 0, "name": "Cat-Cow", "time": 90 }]
}
```

`name` and `sport` are used for the Strava activity; `sport` must be a valid [Strava sport type](https://developers.strava.com/docs/reference/#api-models-SportType) (e.g. `Workout`, `Yoga`, `WeightTraining`, `Run`). A plain array of timers is also supported and defaults to `Workout`.

## Example

You can see an example of the timer application in action [timer.rstm.me](https://timer.rstm.me?url=https://raw.githubusercontent.com/rustamyusupov/timer/refs/heads/main/yoga.json). This example uses a URL to load intervals from a remote JSON file.
