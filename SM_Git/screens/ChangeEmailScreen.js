import React from 'react'
import { useState } from 'react'
import { View, Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { TouchableHighlight } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { supabase } from '../src/supabaseClient'
import styles from '../styles/settingsScreens'

const ChangeEmailScreen = ({navigation, session}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const changeEmail = async (email) => {
      try {
        setLoading(true)
        const { user, error } = await supabase.auth.update({ email: email})

        if(!error)
        navigation.navigate('Profile')
        alert('Confirmation email was sent!')
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
            placeholder="Enter your email"
            label="Email"
            rightIcon={{type:'material', name:'email'}}
            value={email}
            onChangeText={text => setEmail(text)}
            />

            <TouchableHighlight style={styles.button}>
                <Button title='Change email' onPress={(e) => {e.preventDefault()
                   changeEmail(email)}}/>
            </TouchableHighlight>
            <TouchableOpacity style={styles.Btn} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.BtnT}>Cancel</Text>
            </TouchableOpacity>

            
        </View>
    )
}

export default ChangeEmailScreen

