import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';

const scheduleData = [
  // 9/19 schedule
  { date: '2023-09-19', startTime: '09:00', endTime: '10:00', title: 'Team Standup', details: 'Conference Room A', gradient: ['#00ff87', '#60efff'] },
  { date: '2023-09-19', startTime: '10:15', endTime: '11:00', title: 'Product Sync', details: 'Conference Room B', gradient: ['#ff0f7b', '#f89b29'] },
  { date: '2023-09-19', startTime: '11:30', endTime: '12:30', title: 'Client Review', details: 'Conference Room C', gradient: ['#00b4db', '#0083b0'] },
  { date: '2023-09-19', startTime: '13:00', endTime: '14:30', title: 'Roadmap Planning', details: 'Conference Room D', gradient: ['#ff9966', '#ff5e62'] },
  { date: '2023-09-19', startTime: '15:00', endTime: '16:00', title: 'Engineering Update', details: 'Conference Room A', gradient: ['#f09819', '#edde5d'] },
  { date: '2023-09-19', startTime: '16:30', endTime: '17:00', title: 'Wrap-up Meeting', details: 'Conference Room B', gradient: ['#f12711', '#fd1d1d'] },
  
  // 9/20 schedule
  { date: '2023-09-20', startTime: '09:00', endTime: '10:30', title: 'Budget Discussion', details: 'Conference Room C', gradient: ['#ff5f6d', '#ffc371'] },
  { date: '2023-09-20', startTime: '11:00', endTime: '12:00', title: 'UI/UX Review', details: 'Conference Room D', gradient: ['#12c2e9', '#c471ed'] },
  { date: '2023-09-20', startTime: '13:00', endTime: '14:00', title: 'Sales Strategy', details: 'Conference Room A', gradient: ['#f12711', '#f5af19'] },
  { date: '2023-09-20', startTime: '14:30', endTime: '15:30', title: 'Data Analysis', details: 'Conference Room B', gradient: ['#7f7fd5', '#86a8e7'] },
  { date: '2023-09-20', startTime: '16:00', endTime: '17:00', title: 'Marketing Sync', details: 'Conference Room C', gradient: ['#FF4350', '#F43931'] },
  
  // 9/21 schedule
  { date: '2023-09-21', startTime: '09:00', endTime: '10:00', title: 'Security Review', details: 'Conference Room D', gradient: ['#ff9966', '#ff5e62'] },
  { date: '2023-09-21', startTime: '10:30', endTime: '11:30', title: 'Code Review', details: 'Conference Room A', gradient: ['#12c2e9', '#c471ed'] },
  { date: '2023-09-21', startTime: '12:00', endTime: '13:00', title: 'Lunch & Learn', details: 'Conference Room B', gradient: ['#ff5f6d', '#ffc371'] },
  { date: '2023-09-21', startTime: '14:00', endTime: '15:00', title: 'Design Review', details: 'Conference Room C', gradient: ['#f09819', '#edde5d'] },
  { date: '2023-09-21', startTime: '15:30', endTime: '16:30', title: 'Sprint Planning', details: 'Conference Room D', gradient: ['#7f7fd5', '#86a8e7'] },
  { date: '2023-09-21', startTime: '17:00', endTime: '17:30', title: 'Wrap-up Meeting', details: 'Conference Room A', gradient: ['#833ab4', '#fd1d1d'] },

  // 9/22 schedule
  { date: '2023-09-22', startTime: '09:00', endTime: '09:30', title: 'Morning Briefing', details: 'Conference Room B', gradient: ['#00b4db', '#F3FFFF'] },
  { date: '2023-09-22', startTime: '10:00', endTime: '11:00', title: 'Backend Update', details: 'Conference Room C', gradient: ['#00ff87', '#60efff'] },
  { date: '2023-09-22', startTime: '11:30', endTime: '12:30', title: 'QA Sync', details: 'Conference Room D', gradient: ['#ff0f7b', '#f89b29'] },
  { date: '2023-09-22', startTime: '13:30', endTime: '14:30', title: 'Frontend Update', details: 'Conference Room A', gradient: ['#00b4db', '#0083b0'] },
  { date: '2023-09-22', startTime: '15:00', endTime: '16:00', title: 'Weekly Summary', details: 'Conference Room B', gradient: ['#f12711', '#f5af19'] },
  { date: '2023-09-22', startTime: '16:30', endTime: '17:00', title: 'Final Thoughts', details: 'Conference Room C', gradient: ['#7f7fd5', '#86a8e7'] }
];

const startingHour = 7
const endingHour = 22 

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Daily Schedule" component={ScheduleScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const ScheduleScreen = ({ navigation }) => {

  const [currentDate, setCurrentDate] = useState(getLocalISOString());

  const onSwipe = (event) => {
    const { translationX } = event.nativeEvent;
    const [year, month, day] = currentDate.split('-').map(Number);
    let newDate = new Date(year, month - 1, day);
    if (translationX > 50) {
      newDate.setDate(newDate.getDate() - 1);
    } else if (translationX < -50) {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate.toISOString().split('T')[0]);
  };

  const getEventsForDate = (date) => scheduleData.filter(event => event.date === date);
  const eventsForDate = getEventsForDate(currentDate);

  const changeDate = (daysToAdd) => {
    const [year, month, day] = currentDate.split('-').map(Number);
    let dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() + daysToAdd);
    setCurrentDate(dateObj.toISOString().split('T')[0]);
  };

  return (
    <PanGestureHandler onHandlerStateChange={onSwipe}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, height: '7%' }}>
          <TouchableOpacity onPress={() => changeDate(-1)}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18 }}>{currentDate}</Text>
          <TouchableOpacity onPress={() => changeDate(1)}>
            <Text style={{ fontSize: 18 }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Time Slots */}
        {Array.from({ length: (endingHour - startingHour + 1) }, (_, i) => {
          const time = (i + startingHour) % 24;
          const hour = time === 0 ? 12 : (time > 12 ? time - 12 : time);
          const amPm = time < 12 || time === 24 ? 'AM' : 'PM';
          const label = ` ${hour}:00 ${amPm}`;
          return (
            <View key={i} style={{
              height: `${(93 / (endingHour - startingHour + 1))}%`,
              borderBottomWidth: 1,
              justifyContent: 'center', // Center text vertically
              alignItems: 'flex-start'
              }}>
              <Text>{label}</Text>
            </View>
          );
        })}

        {/* Events */}
        {eventsForDate.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={{
              position: 'absolute',
              top: calculateTimePosition(event.startTime),
              height: calculateBlockHeight(event.startTime, event.endTime),
              width: '75%',
              left: '25%',
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
              <Text style={{ fontFamily: 'System' }}>{event.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* Current Time Indicator */}
        {getLocalISOString() === currentDate && (
          <View
            style={{
              position: 'absolute',
              top: calculateCurrentTimePosition(),
              left: 0,
              right: 0,
              height: 2, // Thin line
              backgroundColor: 'red',
              zIndex: 1 // Ensure it is above other elements
            }}
          />
        )}
      </View>
    </PanGestureHandler>
  );
};

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

  const position = (totalMinutes / ((endingHour - startingHour + 1) * 60) * 93 + 7); //1260 minutes from 6AM to 2AM

  return `${position}%`;
};

const calculateBlockHeight = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const durationMinutes = endTotalMinutes - startTotalMinutes;

  const height = (durationMinutes / ((endingHour - startingHour + 1) * 60)) * 93; // Adjusted for 20-hour range
  return `${height}%`;
};

const calculateCurrentTimePosition = () => {
  const now = getCurrentDate();
  const minutes = new Date();
  
  const totalMinutes = ((now.getHours() - startingHour) % 24) * 60 + minutes.getMinutes();
  const position = (totalMinutes / ((endingHour - startingHour + 1) * 60)) * 93 + 7;

  return `${position}%`;
};

const getCurrentDate = () => {
    return new Date();
};

const getLocalISOString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${date}`;
};

export default App;
