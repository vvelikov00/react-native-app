import 'react-native-url-polyfill/auto'
import '@react-native-async-storage/async-storage'
import React from 'react';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from './src/supabaseClient';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { ChatScreen } from './screens/ChatScreen';
import {HomeScreen} from './screens/HomeScreen';
import { UserScreen } from './screens/UserScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AddScreen } from './screens/AddScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NotificationScreen } from './screens/NotificationScreen';
import { StartChatScreen } from './screens/StartChatScreen';
import { StartNewChatScreen } from './screens/StartNewChatScreen';
import { Provider } from 'react-supabase';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null)
  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  return (
    <Provider value={supabase}>
          <NavigationContainer>
       <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} session={session}/>
          <Stack.Screen name="Home" component={HomeScreen} session={session}/>
         <Stack.Screen name="Register" component={RegisterScreen}/>
         <Stack.Screen name="Chat" component={ChatScreen}/>
         <Stack.Screen name="StartChat" component={StartChatScreen}/>
         <Stack.Screen name="StartNewChat" component={StartNewChatScreen}/>
         <Stack.Screen name="Profile" component={UserScreen}/>
         <Stack.Screen name="Settings" component={SettingsScreen}/>
         <Stack.Screen name="Add" component={AddScreen}/>
         <Stack.Screen name="Search" component={SearchScreen}/>
         <Stack.Screen name="OtherUser" component={ProfileScreen}/>
         <Stack.Screen name="Notification" component={NotificationScreen}/>
       </Stack.Navigator>
       
    </NavigationContainer>
</Provider>
    
  );
}


