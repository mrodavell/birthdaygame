import { router } from "expo-router";
import { View, Image, useWindowDimensions, ScrollView } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ShareGame from "../components/sharegame";
import { widthScale, heightScale, moderateWs } from "../helpers/scaler";

export default function Main() {

  const year = new Date().getFullYear();
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const screenHeight = heightScale(dimensions.height);

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.colors.primary }}>
      <ScrollView style={{ maxHeight: screenHeight }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20, marginTop: '15%' }}>
          <View style={{ padding: 20 }}>
            <Image source={require("../../assets/logo.png")}
              style={{ alignSelf: 'center', height: heightScale(150), width: widthScale(150) }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: 10 }}>
            <Text style={{
              fontSize: widthScale(25), fontWeight: "bold", color: "#F9DA83", textShadowColor: "#000000", textShadowRadius: 1,
              textShadowOffset: {
                width: 3,
                height: 2,
              },
              overflow: 'visible'
            }}>
              BIRTHDAY GAME
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
            <Button
              onPress={() => handleNavigation('login')}
              buttonColor={theme.colors.tertiary}
              textColor={theme.colors.inverseOnSurface}
              contentStyle={{ minHeight: heightScale(20) }}
              labelStyle={{ fontSize: moderateWs(12, 1) }}
              style={{ flexGrow: 1 }}
              elevation={5}
              mode="elevated"
            >
              LOGIN
            </Button>
            <Button
              onPress={() => handleNavigation('register')}
              buttonColor={theme.colors.tertiary}
              textColor={theme.colors.inverseOnSurface}
              contentStyle={{ minHeight: heightScale(20) }}
              labelStyle={{ fontSize: moderateWs(12, 1) }}
              style={{ flexGrow: 1 }}
              elevation={5}
              mode="elevated"
            >
              REGISTER
            </Button>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: widthScale(10), marginTop: widthScale(20) }}>
            <Text>Accredited By</Text>
            <Image
              source={require("../../assets/pagcor.png")}
              style={{
                alignSelf: 'center',
                height: heightScale(55),
                width: widthScale(50),
                marginTop: heightScale(5),
              }}
            />
            {/* <Text variant="titleLarge" style={{ marginTop: 20 }}>Demo App Only</Text> */}
          </View>
          <ShareGame />
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: widthScale(10), marginBottom: heightScale(10) }}>
            <Text style={{ fontSize: moderateWs(10, 2) }}>Copyright &copy; {year}. All rights reserved</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 