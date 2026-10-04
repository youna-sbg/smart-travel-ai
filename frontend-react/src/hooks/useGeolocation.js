import { useState, useEffect } from "react";

// این هوک فقط موقعیت کاربر رو ردیابی می‌کنه، هیچ کاری به نقشه نداره
function useGeolocation() {
  const [location, setLocation] = useState(null); // { lat, lng } یا null
  const [statusText, setStatusText] = useState("در حال گرفتن موقعیت شما...");
  const [hasPermissionError, setHasPermissionError] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatusText("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کنه.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setStatusText(`موقعیت شما: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setHasPermissionError(false);
      },
      (error) => {
        setHasPermissionError(true);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatusText("دسترسی به موقعیت رد شد. از تنظیمات مرورگر اجازه بده.");
            break;
          case error.POSITION_UNAVAILABLE:
            setStatusText("موقعیت شما در دسترس نیست.");
            break;
          case error.TIMEOUT:
            setStatusText("زمان گرفتن موقعیت تموم شد. دوباره تلاش کن.");
            break;
          default:
            setStatusText("خطای ناشناخته در گرفتن موقعیت.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    // موقع unmount شدن کامپوننت (مثلاً رفتن به صفحه دیگه)، ردیابی رو متوقف کن
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, statusText, hasPermissionError };
}

export default useGeolocation;
