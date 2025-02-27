import { UploadOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, folder, setState }) {
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false); // State to manage button loading

    useEffect(() => {
        // Check if the script is already loaded
        if (!loaded) {
            const uwScript = document.getElementById("uw");
            if (!uwScript) {
                // If not loaded, create and load the script
                const script = document.createElement("script");
                script.setAttribute("async", "");
                script.setAttribute("id", "uw");
                script.src = "https://upload-widget.cloudinary.com/global/all.js";
                script.addEventListener("load", () => setLoaded(true));
                document.body.appendChild(script);
            } else {
                setLoaded(true);
            }
        }
    }, [loaded]);

    useEffect(() => {
        if (loaded) {
            const initializeCloudinaryWidget = (event) => {
                event.preventDefault();
                setLoading(true); // Set loading state to true
                var myWidget = window.cloudinary.createUploadWidget(
                    { ...uwConfig, folder },  // Use the dynamic folder here
                    (error, result) => {
                        if (!error && result && result.event === "success") {
                            console.log("Done! Here is the image info: ", result.info);
                            setState(prev => [result.info.secure_url]);
                        }
                        setLoading(false); // Set loading state to false after the upload
                    }
                );

                myWidget.open();
            };

            const uploadButton = document.getElementById("upload_widget");

            uploadButton.addEventListener("click", initializeCloudinaryWidget);

            // Cleanup function to remove the event listener
            return () => {
                uploadButton.removeEventListener("click", initializeCloudinaryWidget);
            };
        }
    }, [loaded, uwConfig, folder, setState]);

    return (
        <CloudinaryScriptContext.Provider value={{ loaded }}>
            <Button id="upload_widget" icon={<UploadOutlined />} loading={loading}>
                {loading ? 'Loading...' : 'Upload'}
            </Button>
        </CloudinaryScriptContext.Provider>
    );
}

export default UploadWidget;
export { CloudinaryScriptContext };
