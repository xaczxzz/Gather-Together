import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

interface MemberCardProps {
  //type으로 선언하는게 좋을듯
  member: {
    sid: string;
    name: string;
    major: string;
    status: 'Hold' | 'APPROVE' | 'REJECT';
    joinDate: string; // 신청일
    grade:string;
  };
  onReject(): void;
  onApprove(): void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onReject,
  onApprove,
}) => {
  const getStatusStyle = (status: 'Hold' | 'APPROVE' | 'REJECT') => {
    switch (status) {
      case 'Hold':
        
        return styles.pending;
      case 'APPROVE':
        return styles.approved;
      case 'REJECT':
        return styles.rejected;
      default:
        return {};
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.email}>{member.major}</Text>
        <Text style={styles.date}>가입일: {member.joinDate}</Text>
        <Text style={[styles.status, getStatusStyle(member.status)]}>
          {member.status.toUpperCase() === "HOLD" ? "보류" :""}
        </Text>
      </View>
      <View style={styles.ButtonContainer}>
        {member.status === 'Hold' && (
          <>
            <Button title="승인" onPress={onApprove} />
            <Button title="거절" onPress={onReject} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  approved: {
    color: '#fff',
    backgroundColor: '#4CAF50',
  },
  pending: {
    color: '#fff',
    backgroundColor: '#FFC107',
  },
  rejected: {
    color: '#fff',
    backgroundColor: '#F44336',
  },
  ButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default MemberCard;
