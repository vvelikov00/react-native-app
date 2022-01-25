import { StyleSheet, StatusBar, Platform } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        padding: 10,
        backgroundColor: '#fff',
    },

    button:{
        width: '90%',
        marginTop: 10,
    },

    Btn:{
        width: '90%',
        marginTop: 10,
        alignItems: 'center',
        borderColor: 'dodgerblue',
        borderStyle: 'solid',
    },

    BtnT:{
        marginTop: 10,
        color: 'dodgerblue',
        fontSize: 20,
    },

    fPass: {
        marginTop: 10,
        color: 'black',

    }
})