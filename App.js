import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { getEventsForDate, calculateTimePosition, calculateBlockHeight, getLocalISOString, formatTime, calculateCurrentTimePosition, getCurrentDate } from './Utilities';
import { scheduleData, startingHour, endingHour } from './ConstantValues';

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

  const eventsForDate = getEventsForDate(currentDate, scheduleData);

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
              top: calculateTimePosition(event.startTime, startingHour, endingHour),
              height: calculateBlockHeight(event.startTime, event.endTime, startingHour, endingHour),
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
              top: calculateCurrentTimePosition(startingHour, endingHour),
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

export default App;
