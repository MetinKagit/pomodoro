function startTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById("clock-display").textContent = hours + ":" + minutes;
    setTimeout(startTime, 60000); 
}

window.onload = startTime;