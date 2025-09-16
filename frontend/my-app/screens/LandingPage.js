import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import pic1 from "../assets/pic1.jpg";
import pic2 from "../assets/pic2.png";
import pic3 from "../assets/pic3.jpg";
import styles from "../static/css/LandingStyles";

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
          onPress={() => navigation.navigate("Login")}
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
