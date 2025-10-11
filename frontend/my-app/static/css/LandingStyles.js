import { StyleSheet } from "react-native";

const landingStyles = StyleSheet.create({
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

  // Offering Section
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
    backgroundColor: "#fff",
    maxHeight: 135,
    paddingRight: 15,
  },
  aboutImage: {
    width: 193,
    height: 200,
    marginLeft: 0,
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
    borderColor: "#fff",
    borderRadius: 6,
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#fff",
  },
  historyText: {
    fontSize: 10,
    color: "#fff",
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Contact Us
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
  phoneFrame: {
    width: 360,
    height: 640,
    overflow: "hidden", // hides scrollbars and overflow content
    borderRadius: 20, // optional, makes it look like a phone
    backgroundColor: "#f3ebea",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  webWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0", // light gray backdrop for contrast
  },
});

export default landingStyles;
