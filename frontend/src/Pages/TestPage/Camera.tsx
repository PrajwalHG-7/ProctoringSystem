import { useEffect, useRef } from "react"

declare global {
  interface Window {
    cameraStream?: MediaStream;
  }
}

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                window.cameraStream = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error('Error accessing the camera:', err);
            });

        return () => {
            window.cameraStream?.getTracks().forEach(track => track.stop());
        };
    }, [])

    return (
        <div className="w-1/3 flex justify-end pr-9">
            <div className="text-bright-sun-500 text-3xl font-bold text-center w-fit border-2 border-bright-sun-400 rounded-lg">
                <video ref={videoRef} autoPlay playsInline style={{ maxHeight: '87px', borderRadius: '7px' }} />
            </div>
        </div>
    )
}

export default Camera