import { useSysInfo } from '../../hooks/useSysInfo';

export default function Footer() {

    const [info, connected] = useSysInfo();

    return (
        <footer>
            {connected && Object.keys(info).length > 0 &&
                `CPU: ${info?.cpu}%, RAM: ${info?.memory?.used}/${info?.memory?.total} GB, Disk: ${info?.disks?.[0].used}/${info?.disks?.[0].size} GB`}
        </footer>
    );

}