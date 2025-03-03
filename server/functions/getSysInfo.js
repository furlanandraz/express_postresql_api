import si from 'systeminformation';

const b2gb = (value) => (value / (1024 ** 3)).toFixed(2);
function formatUptime(seconds) {
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds

    const days = Math.floor(seconds / 86400);
    const hours = date.getUTCHours();  // Get hours (UTC to prevent timezone shifts)
    const minutes = date.getUTCMinutes();
    const sec = date.getUTCSeconds();

    return `${days}d ${hours}h ${minutes}m ${sec}s`;
}

export default async function getSysInfo() {
    const {  total: totalMem, free: freeMem, used: usedMem } = await si.mem();
    const memory = { total: b2gb(totalMem), free: b2gb(freeMem), used: b2gb(usedMem) };
    const fsSizeDisks = await si.fsSize();
    const disks = fsSizeDisks.map(disk => {
        const {  size: sizeDisk, available: availableDisk, used: usedDisk } = disk;
        return { size: b2gb(sizeDisk), available: b2gb(availableDisk), used: b2gb(usedDisk) };
    });
    return {
        cpu: (await si.currentLoad()).currentLoad.toFixed(2),
        memory,
        disks,
        uptime: formatUptime(si.time().uptime)
    };
}