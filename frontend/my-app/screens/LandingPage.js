import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import pic1 from "../assets/pic1.jpg";
import pic2 from "../assets/pic2.png";
import pic3 from "../assets/pic3.jpg";

export default function LandingPage() {
  const navigation = useNavigation();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>BAKURAN '21</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")} // navigate to login
        >
          <Text style={styles.headerText}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <ImageBackground source={pic1} style={styles.banner} resizeMode="cover">
        <View style={styles.overlay} />
        <Text style={styles.title}>BAKURAN</Text>
        <Text style={styles.subtitle}>OUTDOOR RESTAURANT DAVAO</Text>
        <Text style={styles.subtitle}>EST. 2021</Text>
      </ImageBackground>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <ImageBackground source={pic2} style={styles.aboutImage} />

        <View style={styles.aboutTextContainer}>
          <Text style={styles.aboutTitle}>ABOUT US</Text>
          <Text style={styles.aboutSubtitle}>
            THE BEST OUTDOOR RESTAURANT IN DAVAO CITY
          </Text>
          <Text style={styles.aboutDetails}>
            CORNER JADE AND GARNET ST GEM VILLAGE MAA DAVAO CITY{"\n"}
            OPEN DAILY FROM 3PM-9:30PM
          </Text>

          {/* Toggle button */}
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => setShowHistory(!showHistory)}
          >
            <Text style={styles.seeMoreText}>
              {showHistory ? "SEE LESS" : "SEE MORE"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Brief History box */}
      {showHistory && (
        <View style={styles.historyBox}>
          <Text style={styles.historyTitle}>BRIEF HISTORY</Text>
          <Text style={styles.historyText}>
            The history of the establishment dates back four years ago when it
            started as a samgyupsal restaurant. Over time, business declined,
            prompting a shift to offering unlimited sisig and a seafood buffet
            after a two-week break. However, earlier this year, in October, the
            seafood buffet was discontinued due to the increasing popularity of
            the unlimited "putok-batok" dishes.
          </Text>
        </View>
      )}

      {/* Offering Section */}
      <View style={styles.offeringSection}>
        <ImageBackground source={pic3} style={styles.offeringImage}>
          <View style={styles.offeringOverlay} />
          <Text style={styles.offeringTitle}>
            WHAT{"\n"}WE CAN{"\n"}OFFER!
          </Text>
          <Text style={styles.offeringSubtitle}>
            UNLIMITED PUTOK BATOK:{"\n"}
            (SISIG,DINAKDAKAN,BULAKLAK)
          </Text>
          <Text style={styles.offeringSubtitle}>SEAFOOD BOIL</Text>
          <Text style={styles.offeringSubtitle}>SEAFOOD BOODLE</Text>
          <Text style={styles.offeringMini}>and more...</Text>
        </ImageBackground>
      </View>

      {/* Contact Us box */}
      <View style={styles.contactBox}>
        <View style={styles.contactTitleBox}>
          <Text style={styles.contactTitle}>CONTACT US</Text>
        </View>
        <Text style={styles.contactText}>
          📍 Corner Jade and Garnet St, Gem Village, Maa, Davao City
        </Text>
        <Text style={styles.contactText}>📞 0912-345-6789</Text>
        <Text style={styles.contactText}>📧 bakuran.restaurant@gmail.com</Text>
        <Text style={styles.contactText}>
          🖥️ https://www.facebook.com/bakurandavao/photos
        </Text>
      </View>

      <Text>
        {"\n"}
        {"\n"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
    top: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#292929",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
  },

  // First Banner
  banner: {
    marginTop: 3,
    height: 150,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
    marginBottom: -7,
  },
  subtitle: {
    marginTop: -4,
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },

  //Offering Section
  offeringSection: {
    margin: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  offeringOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  offeringImage: {
    width: 350,
    height: 380,
  },

  offeringTitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginBottom: 0,
    textAlign: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },

  offeringSubtitle: {
    padding: 3,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  offeringMini: {
    padding: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  // About Section
  aboutSection: {
    marginTop: 45,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#ffffffff",
    maxHeight: 135,
    paddingRight: 15,
  },
  aboutImage: {
    width: 193,
    height: 200,
    marginLeft: -0,
    marginTop: -40,
  },
  aboutTextContainer: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#292929",
    textAlign: "right",
  },
  aboutSubtitle: {
    fontSize: 8,
    fontStyle: "italic",
    color: "#292929",
    textAlign: "right",
  },
  aboutDetails: {
    fontSize: 6,
    color: "#292929",
    marginBottom: 10,
    textAlign: "right",
    fontStyle: "italic",
  },
  seeMoreButton: {
    borderWidth: 1,
    borderColor: "#292929",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-end",
    borderRadius: 4,
  },
  seeMoreText: {
    color: "#292929",
    fontWeight: "bold",
  },

  // History Box
  historyBox: {
    marginTop: 30,
    marginHorizontal: 15,
    padding: 12,
    backgroundColor: "#292929",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ffffffff",
    borderRadius: 6,
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#ffffffff",
  },
  historyText: {
    fontSize: 10,
    color: "#ffffffff",
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "italic",
  },

  //CONTACT US
  contactBox: {
    marginTop: 5,
    marginBottom: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#292929",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
  },
  contactTitleBox: {
    marginBottom: 10,
    padding: 0,
  },
  contactTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#292929",
    textAlign: "center",
  },
  contactText: {
    fontSize: 10,
    color: "#292929",
    marginBottom: 4,
  },
});
