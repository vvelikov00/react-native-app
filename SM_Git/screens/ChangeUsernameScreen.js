import React from 'react'
import { useState } from 'react'
import { View, Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { TouchableHighlight } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { supabase } from '../src/supabaseClient'
import styles from '../styles/settingsScreens'

const ChangeUsernameScreen = ({navigation, session}) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);



    const ChangeUsername = async (username) => {
      try {
        setLoading(true)
        const userO = supabase.auth.user()
        const oldUsername = userO.user_metadata.username
        const { user, error } = await supabase.auth.update({ 
          data: {username: username}
        })

        if(!error)
        navigation.navigate('Profile')
        if (error) throw error
          
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        setLoading(false)
        
      }
    }






    return (
        <View style={styles.container}>
           
           <Input
            placeholder="Enter your username"
            label="Username"
            rightIcon={{type:'material', name:'person'}}
            value={username}
            onChangeText={text => setUsername(text)}
            />

            <TouchableHighlight style={styles.button}>
                <Button title='Change username' onPress={(e) => {e.preventDefault()
                   ChangeUsername(username)}}/>
            </TouchableHighlight>
            <TouchableOpacity style={styles.Btn} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.BtnT}>Cancel</Text>
            </TouchableOpacity>

            
        </View>
    )
}

export default ChangeUsernameScreen

