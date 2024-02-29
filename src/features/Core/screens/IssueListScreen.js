import { useDriver, useFleetbase } from 'hooks';
import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'tailwind';
import { getColorCode } from 'utils';

const IssueListScreen = ({ navigation, route }) => {
    // const { currentIssueListScreen } = route.params;
    const [driver] = useDriver();
    const fleetbase = useFleetbase();
    const [issues, setIssueListScreens] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchIssues = async () => {
        try {
            const adapter = fleetbase.getAdapter();
            const issues = await adapter.get('issues');
            console.log('list------>', issues);
            return issues;
        } catch (error) {
            console.error('Error fetching  issue:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => confirmSwitchIssueListScreen(item.id)}>
            <View style={[tailwind('p-1')]}>
                <View style={[tailwind('px-4 py-2 flex flex-row items-center rounded-r-md')]}>
                    <Text style={tailwind('text-gray-50 text-base')} numberOfLines={1}>
                        <Text>{item?.getAttribute('name')}</Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={tailwind('w-full h-full bg-gray-800 flex-grow')}>
            <View style={tailwind('flex flex-row items-center justify-between p-4 ')}>
                <View>
                    <Text style={tailwind('font-bold text-white text-base')}>Issue</Text>
                </View>
            </View>

            <FlatList
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchIssues} tintColor={getColorCode('text-blue-200')} />}
                data={issues}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

export default IssueListScreen;
