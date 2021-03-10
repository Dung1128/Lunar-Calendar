import React from 'react'
import {
    View,
    Text,
} from 'react-native'
import moment from 'moment'

export default class DayComponent extends React.PureComponent {

    customStyleDate(date) {
        if (date.dateString == moment().format('YYYY-MM-DD')) {
            return {
                backgroundColor: '#FFC20E',
            }
        }

        return {
            // backgroundColor: '#F4F7FD',
            backgroundColor: '#fff',
        }

    }

    customStyleTitleDate(date) {

        // if (date.dateString == moment().format('YYYY-MM-DD')) {
        //     return {
        //         color: '#fff',
        //         fontWeight: 'bold',
        //     }
        // }

        return {
            color: '#050505',
        }

    }

    render() {
        const { lunarDay, lunarMonth, date } = this.props;

        return (
            <View style={{
                width: 44,
                height: 44,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                padding: 5,
                ...this.customStyleDate(date),
            }}>
                <View >
                    <Text style={{
                        fontSize: 16,
                        ...this.customStyleTitleDate(date),
                    }}>
                        {date.day}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{
                        fontSize: 11,
                        color: '#9097A5',

                        ...this.customStyleTitleDate(date)
                    }}>
                        {lunarDay} {lunarDay == 1 && `/${lunarMonth}`}
                    </Text>
                </View>

            </View>
        )
    }
}