import { router } from "expo-router";
import { View, Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Main() {

  const year = new Date().getFullYear();
  const theme = useTheme();

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.colors.primary }}>
      <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20, marginTop: '40%' }}>
        <View style={{ padding: 20 }}>
          <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: 200, width: 200 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: 10 }}>
          <Text style={{
            fontSize: 40, fontWeight: "bold", color: "#F9DA83", textShadowColor: "#000000", textShadowRadius: 1,
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
            contentStyle={{ minHeight: 20 }}
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
            contentStyle={{ minHeight: 20 }}
            style={{ flexGrow: 1 }}
            elevation={5}
            mode="elevated"
          >
            REGISTER
          </Button>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 140 }}>
          <Text>Accredited By</Text>
          <Image source={require("../../assets/pagcor.png")} style={{ alignSelf: 'center', height: 70, width: 70 }} />
          <Text variant="titleLarge" style={{ marginTop: 20 }}>Demo App Only</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: 30 }}>
          <Text>Copyright &copy; {year}. All rights reserved</Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 