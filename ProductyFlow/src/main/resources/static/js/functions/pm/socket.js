const websocketUrl = "http://localhost:8080/notify-channels"
const topic = "/group/";
var client = null;

export function connect(gid) {
    const sock = new SockJS(websocketUrl);
    client = Stomp.over(sock);
    client.connect({}, () => {
        client.subscribe(topic + gid, payload => {
            updateInfo(JSON.parse(payload.body).message);
        });
    });
    console.log("Connected");
};

export function disconnect() {
    if (client !== null) {
        client.disconnect();
        console.log("Disconnected");
    };
}

export function sendMessage(gid, message) {
    client.send(app + gid, {}, JSON.stringify({ 'message': message }));
};

export function updateInfo(message) {
    console.log(message)
};
