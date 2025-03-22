import si from "systeminformation";

const b2gb = (value) => (value / (1024 ** 3)).toFixed(2);

function formatUptime(seconds) {
    const date = new Date(seconds * 1000);
    const days = Math.floor(seconds / 86400);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const sec = date.getUTCSeconds();

    return `${days}d ${hours}h ${minutes}m ${sec}s`;
}

export default async function sysInfo(ws) {
    try {
        const timer = setInterval(async () => {
            const { total: totalMem, free: freeMem, used: usedMem } = await si.mem();
            const memory = { total: b2gb(totalMem), free: b2gb(freeMem), used: b2gb(usedMem) };
            const fsSizeDisks = await si.fsSize();
            const disks = fsSizeDisks.map(disk => ({
                size: b2gb(disk.size),
                available: b2gb(disk.available),
                used: b2gb(disk.used)
            }));

            const sysInfo = {
            cpu: (await si.currentLoad()).currentLoad.toFixed(2),
            memory,
            disks,
            uptime: formatUptime(si.time().uptime)
            };
            ws.send(JSON.stringify(sysInfo));
        }, 1000); 
        ws.on('close', () => {
            if (timer) clearInterval(timer);
        });
    } catch (error) {
        console.error("Error fetching system info:", error);
    }
}
