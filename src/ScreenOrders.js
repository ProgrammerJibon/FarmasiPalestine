import React from "react";
import { View } from "react-native";
import loadJson from "./loadJson";
import { apiBinder } from "./Styles";

let once = true;
const ScreenOrders = (props) => {
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;

    if (once) {
        once = false;
        loadJson(apiBinder("wp-json/wc/v3/orders/?customer_id=10")).then(res => {
            console.log(res)
        })
    }

    return (
        <View>

        </View>
    );
};

export default ScreenOrders;
