import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskScreen from '../screens/TaskScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { useColorScheme } from 'react-native';
import { AppTabParamList } from '../types';
import CalenderScreen from '../screens/CalenderScreen';
import MoodScreen from '../screens/MoodScreen';
import SummaryScreen from '../screens/SummaryScreen';
const Tab = createBottomTabNavigator<AppTabParamList>();
const AppTabNavigation = () => {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#8E8E93' : '#999999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#38383A' : '#E5E5E5',
        },
      }}
    >
      <Tab.Screen
        name="Task"
        component={TaskScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Task',
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalenderScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Calender',
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Mood',
        }}
      />
      <Tab.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Summary',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNavigation;
