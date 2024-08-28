import { PDFViewer } from "@react-pdf/renderer"
import App from "./App"
export default function Pdf()
{
    return(
        <PDFViewer width="100%" height="600">
      <App />
    </PDFViewer>
    )
}