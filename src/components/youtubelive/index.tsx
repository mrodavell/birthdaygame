import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

const YoutubeLive = () => {

    return (
        <View style={{ flex: 1, borderWidth: 1, width: '100%', minHeight: 200, marginTop: 40, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons
                name="youtube"
                color="red"
                size={150}
            />
        </View>
    );
}

export default YoutubeLive;