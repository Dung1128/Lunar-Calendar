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
                backgroundColor: '#425486',
            }
        }

        return {
            backgroundColor: '#F4F7FD',
        }

    }

    customStyleTitleDate(date) {

        if (date.dateString == moment().format('YYYY-MM-DD')) {
            return {
                color: '#fff',
                fontWeight: 'bold',
            }
        }

        return {
            color: '#425486',
        }

    }

    render() {
        const { lunarDay, lunarMonth, date } = this.props;

        return (
            <View style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                padding: 5,
                ...this.customStyleDate(date)
            }}>
                <Text style={{
                    fontSize: 15,
                    ...this.customStyleTitleDate(date),
                }}>
                    {date.day}
                </Text>
                <Text style={{
                    fontSize: 10,
                    color: '#9097A5',
                    ...this.customStyleTitleDate(date)
                }}>
                    {lunarDay} {lunarDay == 1 && `/${lunarMonth}`}
                </Text>
            </View>
        )
    }
}