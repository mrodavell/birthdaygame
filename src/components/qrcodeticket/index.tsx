import QRCode from 'react-native-qrcode-svg';
import { widthScale } from '../../helpers/scaler';

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
            value={`${drawnumber}-${serial}-${drawdate}-${datepurchased}-${phone?.toString().slice(-4)}`}
            logoSize={30}
            logo={logo}
            size={widthScale(120)}
        />
    )
}