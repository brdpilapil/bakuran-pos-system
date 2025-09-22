import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: 540,
    height: 1200,
    backgroundColor: "#5E1D19",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  iconBtn: {
    padding: 10,
  },
  iconText: {
    fontSize: 28,
    color: "#F2F1ED",
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: "contain",
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#F2F1ED",
    marginVertical: 10,
  },
  item: {
    backgroundColor: "#F2F1ED",
    borderColor: "#5E1D19",
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 12,
  },
  info: {
    marginBottom: 8,
  },
  text: {
    color: "#5E1D19",
    fontSize: 14,
    marginVertical: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteBtn: {
    backgroundColor: "#5E1D19",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  editBtn: {
    backgroundColor: "#B79D98",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  btnText: {
    color: "#F2F1ED",
    fontWeight: "bold",
    fontSize: 14,
  },
});
