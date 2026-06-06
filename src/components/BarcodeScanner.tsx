import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface BarcodeScannerProps {
    onDetected: (code: string) => void;
    onClose: () => void;
    onError?: (message: string) => void;
}

const BarcodeScanner = ({ onDetected, onClose, onError }: BarcodeScannerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        let controls: IScannerControls | undefined;
        let active = true;

        reader
            .decodeFromVideoDevice(undefined, videoRef.current!, (result, _err, ctrl) => {
                if (!controls) controls = ctrl;
                if (result && active) {
                    active = false;
                    ctrl.stop();
                    onDetected(result.getText());
                }
            })
            .then((ctrl) => {
                controls = ctrl;
            })
            .catch((e) => {
                console.error("Camera/scanner error:", e);
                onError?.("Could not access the camera. Check permissions and try again.");
                onClose();
            });

        return () => {
            active = false;
            controls?.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl">
                <video ref={videoRef} className="w-full" />
                {/* Aiming frame */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-32 w-4/5 rounded-lg border-4 border-white/80" />
                </div>
            </div>
            <p className="mt-6 text-center text-white">Point your camera at a product barcode</p>
            <Button variant="secondary" className="mt-6" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} className="mr-2" />
                Cancel
            </Button>
        </div>
    );
};

export default BarcodeScanner;
