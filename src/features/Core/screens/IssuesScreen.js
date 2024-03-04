import { useDriver, useFleetbase, useMountedState } from 'hooks';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'tailwind';
import { useNavigation } from '@react-navigation/native';
import { getColorCode, translate } from 'utils';

const IssuesScreen = () => {
    const navigation = useNavigation();
    const isMounted = useMountedState();
    const [driver] = useDriver();
    const fleetbase = useFleetbase();
    const [issues, setIssueList] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchIssues = async () => {
        try {
            const adapter = fleetbase.getAdapter();
            const response = await adapter.get('issues');
            setIssueList(response);
            return response;
        } catch (error) {
            console.error('Error fetching  issue:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchIssues();
        });

        return unsubscribe;
    }, [isMounted]);

    const renderItem = ({ item }) => (
        <View style={tailwind('p-3')}>
            <TouchableOpacity
                style={tailwind('bg-gray-900 border border-gray-800 rounded-xl shadow-sm w-full ')}
                onPress={() => navigation.navigate('IssueScreen', { issue: item, isEdit: true })}>
                <View style={tailwind('flex flex-row items-center justify-between py-2 px-3')}>
                    <View style={tailwind('flex-1')}>
                        <Text style={tailwind('text-gray-100')}>Report:</Text>
                    </View>
                    <View style={tailwind('flex-1 flex-col items-end')}>
                        <Text style={tailwind('text-gray-100')}>{item.report}</Text>
                    </View>
                </View>
                <View style={tailwind('flex flex-row items-center justify-between py-2 px-3')}>
                    <View style={tailwind('flex-1')}>
                        <Text style={tailwind('text-gray-100')}>Drive name: </Text>
                    </View>
                    <View style={tailwind('flex-1 flex-col items-end')}>
                        <Text style={tailwind('text-gray-100')}>{item.driver_name}</Text>
                    </View>
                </View>
                <View style={tailwind('flex flex-row items-center justify-between py-2 px-3')}>
                    <View style={tailwind('flex-1')}>
                        <Text style={tailwind('text-gray-100')}>Vehicle name:</Text>
                    </View>
                    <View style={tailwind('flex-1 flex-col items-end')}>
                        <Text style={tailwind('text-gray-100')}>{item.vehicle_name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={tailwind('w-full h-full bg-gray-800 flex-grow')}>
            <View style={tailwind('flex flex-row items-center justify-between p-4 ')}>
                <View>
                    <Text style={tailwind('font-bold text-white text-base')}>Issues</Text>
                </View>
            </View>

            <FlatList
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchIssues} tintColor={getColorCode('text-blue-200')} />}
                data={issues}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
            <View style={tailwind('p-4')}>
                <View style={tailwind('flex flex-row items-center justify-center')}>
                    <TouchableOpacity
                        style={tailwind('flex-1')}
                        onPress={() => {
                            navigation.navigate('IssueScreen');
                        }}>
                        <View style={tailwind('btn bg-gray-900 border border-gray-700')}>
                            <Text style={tailwind('font-semibold text-gray-50 text-base')}>{translate('Core.IssueScreen.create')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default IssuesScreen;
