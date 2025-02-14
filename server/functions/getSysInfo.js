import si from 'systeminformation';

export async function getSysInfo() {
    return {
        cpu: await si.currentLoad(),
        memory: await si.mem(),
        disk: await si.fsSize(),
        uptime: await si.time()
    };
}