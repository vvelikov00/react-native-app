import React from 'react'
import { useState } from 'react'
import { View, Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { TouchableHighlight } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { supabase } from '../src/supabaseClient'
import styles from '../styles/settingsScreens'

const ChangePasswordScreen = ({navigation, session}) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const changePassword = async (password) => {
      try {
        setLoading(true)
        const { user, error } = await supabase.auth.update({ password: password})

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
            placeholder="Enter your password"
            label="Password"
            rightIcon={{type:'material', name:'lock'}}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            />

            <TouchableHighlight style={styles.button}>
                <Button title='Change password' onPress={(e) => {e.preventDefault()
                   changePassword(password)}}/>
            </TouchableHighlight>
            <TouchableOpacity style={styles.Btn} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.BtnT}>Cancel</Text>
            </TouchableOpacity>

            
        </View>
    )
}

export default ChangePasswordScreen

