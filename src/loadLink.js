import React from "react";
import { ScrollView } from "react-native";
import RenderHTML from "react-native-render-html";
import DeviceInfo from "react-native-device-info";

const LoadLink = (props) => {
  /*
  * @author MD. Jibon Howlader
  * @farmasipalestine version: 2.0
  * */
  const styles = props.styles;
  const defines = props.defines;
  const window = props.window;
  const html = `
        <br>
        <br>
        <h2>About</h2>
        <h4>App name: Farmasi Palestine</h4>
        <h4>App version: ${DeviceInfo.getVersion()}</h4>
        <h4>Compatibility: Android/iOS</h4>
        <h3>Offered by: Ibdaa Co.</h3>
        <h5>Email: <a href="mailto:ibdaaps21@gmail.com">ibdaaps21@gmail.com</a></h5>
        <h6>تطبيق فارمسي هو تطبيق لبيع منتجات فارمسي العالمية من مستحضرات التجميل والعناية بالبشرة والتغذية.
        فارمسي :
        علامة تجارية يمكن أن تلمس حياة الجميع وأحلامهم من خلال فهمها لإنتاج مستحضرات التجميل بجودة عالية ، مجموعة واسعة من المنتجات الصحية وعالية الجودة . إنه يوفر للناس فرصة رائعة لاكتشاف جمالهم من خلال المنتجات التي تم تطويرها مستوحاة من أحلام النساء</h6>
        <br><a href="https://g.dev/u/programmerjibon"><h2>Developed by ProgrammerJibon</h2></a>
        <h3>Full Name: Md. Jibon Howlader</h3>
        <h3>Website: <a href="https://www.jibon.io/">www.jibon.io</a></h3>
        <h3>Email: <a href="mailto:mail@jibon.io">mail@jibon.io</a></h3>
        <h3>Contact: <a href="https://www.freelancer.com/u/ProgrammerJibon">Freelancer</a>, <a href="https://www.instagram.com/programmerjibon/">Instagram</a></h3>
    `;
  return (
    <ScrollView>
      <RenderHTML contentWidth={window.width}
                  enableExperimentalRtl={true}
                  baseStyle={{
                    color: "black",
                    fontWeight: "bold",
                  }}
                  listStyleType="disc"
                  tagsStyles={{
                    ol: {
                      listStyleType: "none",
                    },
                    ul: {
                      listStyleType: "none",
                    },
                    li: {
                      width: window.width - 64,
                      color: "gray",
                    },
                    h1: { fontSize: "24px", margin: 8 },
                    h2: {
                      fontSize: "16px",
                      margin: 8,
                      color: defines.backDarkPrimary,
                      textDecorationLine: "none",
                    },
                    h3: { fontSize: "14px", margin: 8 },
                    h4: { fontSize: "12px", margin: 8 },
                    h5: { fontSize: "10px", margin: 8 },
                    h6: { fontSize: "8px", margin: 8 },
                    div: { margin: 8 },
                    a: { color: defines.backLightPrimary },
                  }}
                  source={{
                    html: html,
                  }} />
    </ScrollView>
  );
};

export default LoadLink;
