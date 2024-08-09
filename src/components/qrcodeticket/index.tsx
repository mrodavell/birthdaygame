import QRCode from 'react-native-qrcode-svg';

type TQRCodeProps = {
    serial: string,
    drawdate: string,
    drawnumber: string,
    datepurchased: string,
    phone?: string | number
}

export default function QRCodeTicket({ serial, drawdate, drawnumber, datepurchased, phone }: TQRCodeProps) {

    const logo = require('../../../assets/logo.png');

    return (
        <QRCode
            value={`${serial}-${drawdate}-${drawnumber}-${datepurchased}-${phone}`}
            logoSize={30}
            logo={logo}
            size={150}
        />
    )
}