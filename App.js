import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

const scheduleData = [
  { date: '2023-09-19', startTime: '09:00', endTime: '10:00', title: 'Meeting 1', details: 'Conference Room A', gradient: ['#00ff87', '#60efff'] },
  { date: '2023-09-19', startTime: '11:00', endTime: '12:30', title: 'Meeting 2', details: 'Conference Room A', gradient: ['#ff0f7b', '#f89b29'] },
  { date: '2023-09-19', startTime: '13:00', endTime: '16:30', title: 'Meeting 3', details: 'Conference Room A', gradient: ['#ff0f7b', '#f89b29'] },
  { date: '2023-09-20', startTime: '11:00', endTime: '12:30', title: 'Meeting 4', details: 'Conference Room A', gradient: ['#ff0f7b', '#f89b29'] },
  { date: '2023-09-20', startTime: '22:00', endTime: '23:00', title: 'Meeting 5', details: 'Conference Room A', gradient: ['#ffa585', '#ffeda0'] },
];

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const ScheduleScreen = ({ navigation }) => (
  <View style={{ flex: 1, backgroundColor: 'white'  }}>
    {Array.from({ length: 21 }, (_, i) => {
      const time = (i + 6) % 24;
      const hour = time === 0 ? 12 : (time > 12 ? time - 12 : time);
      const amPm = time < 12 || time === 24 ? 'AM' : 'PM';
      const label = ` ${hour}:00 ${amPm}`;
      return (
        <View key={i} style={{
          height: '4.76%',
          borderBottomWidth: 1,
          justifyContent: 'center', // Center text vertically
          alignItems: 'flex-start'
          }}>
          <Text>{label}</Text>
        </View>
      );
    })}
    {scheduleData.map((event, index) => (
    <TouchableOpacity
      key={index}
      style={{
        position: 'absolute',
        top: calculateTimePosition(event.startTime),
        height: calculateBlockHeight(event.startTime, event.endTime),
        width: '80%',
        left: '20%',
        borderRadius: 10 // Rounded corners
      }}
      onPress={() => navigation.navigate('EventDetail', { event })}
    >
      <LinearGradient
        colors={event.gradient}
        style={{
          flex: 1,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
        <Text style={{ fontFamily: 'Arial' }}>{event.title}</Text>
      </LinearGradient>
        </TouchableOpacity>
  ))}
    <View
      style={{
        position: 'absolute',
        top: calculateCurrentTimePosition(),
        left: 0,
        right: 0,
        height: 1, // Thin line
        backgroundColor: 'red',
        zIndex: 1 // Ensure it is above other elements
      }}
    />
  </View>
);

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;

  const formatTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 || hour === 24 ? "AM" : "PM";
    const formattedHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    const formattedMinute = String(minute).padStart(2, "0");

    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Setting the screen title
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: event.title });
  }, [navigation, event.title]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{event.title}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>Start: </Text>
        <Text>{formatTime(event.startTime)}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>End: </Text>
        <Text>{formatTime(event.endTime)}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>Details: </Text>
        <Text>{event.details}</Text>
      </View>
    </View>
  );
};

const calculateTimePosition = (startTime) => {
  const [hour, minute] = startTime.split(':').map(Number);
  const totalMinutes = ((hour - 6 + 24) % 24) * 60 + minute; // Adjust for 6AM start

  const position = (totalMinutes / 1260) * 100; // 1260 minutes from 6AM to 2AM
  return `${position}%`;
};

const calculateBlockHeight = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const durationMinutes = endTotalMinutes - startTotalMinutes;

  const height = (durationMinutes / 1260) * 100; // Adjusted for 20-hour range
  return `${height}%`;
};

const calculateCurrentTimePosition = () => {
  const now = new Date();
  const totalMinutes = ((now.getHours() - 6 + 24) % 24) * 60 + now.getMinutes(); // Adjust for 6AM start

  const position = (totalMinutes / 1260) * 100; // 1260 minutes from 6AM to 2AM
  return `${position}%`;
};

export default App;
