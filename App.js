import {
  Button,
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
function App() {
  const [time, setTime] = useState(1800);
  const [timerOn, setTimerOn] = useState(false);
  const [endTime, setEndTime] = useState(nowPlus(time));
  const [showTimeSetter, setShowTimeSetter] = useState(false);
  const newTime = useRef(new Date(0, 0, 0, 0, 30, 0, 0));
  // if the timer is on and the timeSetter is off, update time
  useEffect(() => {
    if (timerOn && time != 0 && !showTimeSetter) {
      const timeout = setTimeout(() => {
        setTime(time - 1); // subtract 1 second
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [time, timerOn]);

  // update endTime if the timer and the timeSetter are off
  useEffect(() => {
    if (!timerOn && !showTimeSetter) {
      const timeout = setTimeout(() => {
        setEndTime(endTime + 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [timerOn, endTime]);
  function handleShowTimeSetter() {
    setShowTimeSetter(true);
  }
  function handleTimeSet(e, date) {
    setShowTimeSetter(false);
    if (e.type == "set") {
      newTime.current = date;
      console.log(date.getHours() + ":" + date.getMinutes());

      const inSeconds =
        newTime.current.getHours() * 3600 + newTime.current.getMinutes() * 60;
      setTime(inSeconds);
      setEndTime(nowPlus(inSeconds));
    }
  }
  return (
    <View style={styles.container}>
      {/* countdown */}
      <Text style={[styles.Countdown]}>{toHHMMSS(time, 24).string}</Text>

      {/* end time */}
      <Text style={[styles.EndTime]}>{toHHMMSS(endTime, 12).string}</Text>
      <View style={styles.controller}>
        {/* button */}
        <Pressable style={styles.button} onPress={() => setTimerOn(!timerOn)}>
          <Text style={styles.buttonText}>{timerOn ? "Stop" : "Start"}</Text>
        </Pressable>

        {/* Set Time */}
        <Pressable style={styles.button} onPress={() => handleShowTimeSetter()}>
          <Text style={styles.buttonText}>{"SET TIME"}</Text>
        </Pressable>
      </View>
      {/* Time Setter */}
      {showTimeSetter && (
        <DateTimePicker
          mode="time"
          display="spinner"
          value={newTime.current}
          is24Hour={true}
          onChange={handleTimeSet}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17191a",
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight,
  },
  Countdown: {
    fontSize: 75,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
  },
  EndTime: {
    fontSize: 25,
    fontWeight: "bold",
    color: "gray",
  },
  controller: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#131415",
    padding: 10,
    borderRadius: 4,
    display: "inline",
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
});
function nowPlus(secs) {
  let nowSecs = new Date().getTime();
  nowSecs += new Date().getTimezoneOffset() * 60 * 1000;
  return (nowSecs + secs * 1000) / 1000;
}
/**
 * Converts seconds to HH:MM:SS format
 * @param {number} secs - The number of seconds to convert
 * @returns {string} The time in HH:MM:SS format
 */
function toHHMMSS(secs, format = 24) {
  // Convert secs to integer
  const sec_num = parseInt(secs, 10);
  // Calculate hours
  const hours = Math.floor(sec_num / 3600) % format;

  // Calculate minutes
  const minutes = Math.floor(sec_num / 60) % 60;

  // Calculate seconds
  const seconds = sec_num % 60;
  const formattedTime = { seconds, hours, minutes };
  // Format hours, minutes, and seconds to have leading zeros if necessary
  formattedTime.string = [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");

  return formattedTime;
}

export default App;
