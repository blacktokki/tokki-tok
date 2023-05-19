import {StyleSheet} from "react-native";
export {useLocalCam, useRemoteCam} from "./p2p"

export const camStyle = StyleSheet.create({
	container:{ flex: 1},
	cam:{ flex: 1, height:'100%'},
	bottonContainer: {position:"absolute", bottom:0, justifyContent:'flex-end'},
	buttonBar: { flexDirection: "row", justifyContent: "space-around" },
	label: {backgroundColor:'#0008', color:'white', paddingHorizontal:5},
})