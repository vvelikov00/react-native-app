import { StyleSheet, StatusBar, Platform } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    header: {
        width: "100%",
        height: "6%",
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },

    footer: {
        paddingLeft: '1%',
        paddingRight: '1%',
        left: 0, 
        right: 0, 
        bottom: 0,
        width: "100%",
        height: "6%",
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: 'space-between',
    },

   logo:{
       width: "100%",
       height: "100%",
   },

   add: {
       alignSelf:'center',
       
   },

   content: {
    padding: 10,
    height: '88%'
  },

  post: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: 'white'
  },

  lastPost: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: 'white',
    marginBottom: '7%'
  },

  postHeader: {
    flexDirection: 'row',
    
  },

  postProfileImg: {
    width:'10%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: '1%',
    marginTop: '1%',
    borderRadius: 10,
    marginLeft: '3%', 
  },

  postUsername: {
    alignSelf: 'center',
    marginLeft: '5%',
    fontSize: 15
  },

  postImg: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 5,
    
  },

  uploadImg: {
    width: "90%",
    height: undefined,
    aspectRatio: 1,
    alignSelf: 'center',
    marginBottom: '2%',

  },

  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },

  result: {
      marginTop: '2%',
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 6,
      borderWidth: 0.5,
      backgroundColor: 'white'
   },

   resultImg: {
       width: '15%',
       height: undefined,
       aspectRatio: 1,
       borderRadius: 6,
       
   },

   text: {
       marginLeft: '10%'
   },
   
   username: {
       fontSize: 15,
   },

   fullname: {
       fontSize: 25
   },
   
   profile: {
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
   },

   addFriend: {
    width: "100%",
    alignItems: 'center',
    marginBottom: '1%',
    borderRadius: 5
  },
});