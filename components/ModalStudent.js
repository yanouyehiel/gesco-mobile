import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  FlatList
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import axios from 'axios'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { dateParser } from '@/utils/fonctions'
import { showToast } from '../utils/fonctions'

const ModalStudent = ({ student, headers, visible, setVisible }) => {
  const parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
  const [loading, setLoading] = useState(true)
  const [feesStudent, setFeesStudent] = useState(null)

  useEffect(() => {
    if (visible) {
      getFeesStudent().then(() => setLoading(false))
    }
  }, [student, visible])

 async function getFeesStudent() {
  try {
    // Defensive: ensure student.id and headers exist
    if (!student?.id) {
      console.log("❗ student.id is missing");
      return showToast("Élève invalide.");
    }

    if (!parsedHeaders?.authorization) {
      console.log("❗ Authorization header is missing");
      return showToast("Identifiants manquants.");
    }

    // Construct valid headers
    const headers = {
      Accept: "application/json",
      Authorization: parsedHeaders.authorization,
    };

    console.log(" Fetching fees for student:", student.id, "with headers:", headers);

    // API request
    const res = await axios.get(
      `https://gesco-app.com/gesco/api/get-fees-student/${parseInt(student.id)}`,
      { headers }
    );

    console.log("✅ Fees data:", res.data);
    setFeesStudent(res.data);
    
  } catch (err) {
    // Full error breakdown
    console.log(" Error:", err);
    if (err.response) {
      console.log(" Backend Error Response:", err.response.data);
      console.log(" Status:", err.response.status);
    } else if (err.request) {
      console.log(" No response received:", err.request);
    } else {
      console.log(" Request setup error:", err.message);
    }

    showToast("Erreur serveur: " + err.message);
    setLoading(false);
  }
}


  return (
    <Modal
      visible={visible}
      animationType='slide'
      onRequestClose={() => setVisible(false)}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setVisible(false)}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name='arrow-back-outline' size={24} color={colors.NOIR} />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Détails de l'élève</Text>
          <View style={{ width: 70 }} /> 
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Student Profile Card */}
          <View style={[styles.card, styles.profileCard]}>
            <View style={styles.profileContent}>
              <Text style={styles.studentName}>
                {student.nom} {student.prenom}
              </Text>
              <View style={styles.matriculeBadge}>
                <Text style={styles.matriculeText}>{student.matricule}</Text>
              </View>
              <View style={styles.studentDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="transgender" size={18} color={colors.BLANC} />
                  <Text style={styles.detailText}>{student.sexe}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="school" size={18} color={colors.BLANC} />
                  <Text style={styles.detailText}>{student.nom_classe}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar" size={18} color={colors.BLANC} />
                  <Text style={styles.detailText}>{student.date_naissance}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Fees Section */}
          <View style={styles.section}>
            <Heading text="Tarifs scolaires" />
            <View style={styles.feesGrid}>
              <FeeCard 
                title="Inscription" 
                amount={feesStudent?.tarifs.inscription} 
                loading={loading} 
                color={colors.BLEU}
              />
              <FeeCard 
                title="1ère Tranche" 
                amount={feesStudent?.tarifs.premiere_tranche} 
                loading={loading} 
                color={colors.VERT}
              />
              <FeeCard 
                title="2ème Tranche" 
                amount={feesStudent?.tarifs.deuxieme_tranche} 
                loading={loading} 
                color={colors.ORANGE}
              />
              <FeeCard 
                title="3ème Tranche" 
                amount={feesStudent?.tarifs.troisieme_tranche} 
                loading={loading} 
                color={colors.ROUGE}
              />
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.section}>
            <Heading text="Résumé financier" />
            <View style={styles.summaryRow}>
              <SummaryCard 
                title="Total" 
                amount={feesStudent?.total} 
                loading={loading} 
                icon="calculator"
              />
              <SummaryCard 
                title="Payé" 
                amount={feesStudent?.paye} 
                loading={loading} 
                icon="checkmark-circle"
              />
              <SummaryCard 
                title="Reste" 
                amount={feesStudent?.reste} 
                loading={loading} 
                icon="alert-circle"
              />
            </View>
          </View>

          {/* Payments History */}
          <View style={styles.section}>
            <Heading text="Historique des paiements" />
            {loading ? (
              <PaymentsSkeleton />
            ) : feesStudent?.paiements?.length > 0 ? (
              <FlatList
                data={feesStudent.paiements}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <PaymentItem 
                    code={item.code}
                    intitule={item.intitule}
                    montant={item.montant}
                    annee={item.annee_scolaire}
                    date={item.created_at}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <NoData message="Aucun paiement enregistré" />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

// Reusable Fee Card Component
const FeeCard = ({ title, amount, loading, color }) => (
  <View style={[styles.feeCard, { backgroundColor: `${color}20` }]}>
    <Text style={[styles.feeTitle, { color }]}>{title}</Text>
    <View style={[styles.amountBadge, { backgroundColor: color }]}>
      {loading ? (
        <Skeleton colorMode="light" height={20} width={80} />
      ) : (
        <Text style={styles.amountText}>{amount || 0} XAF</Text>
      )}
    </View>
  </View>
)

// Reusable Summary Card Component
const SummaryCard = ({ title, amount, loading, icon }) => (
  <View style={styles.summaryCard}>
    <Ionicons name={icon} size={24} color={colors.VERT} />
    <Text style={styles.summaryTitle}>{title}</Text>
    {loading ? (
      <Skeleton colorMode="light" height={20} width={60} />
    ) : (
      <Text style={styles.summaryAmount}>{amount || 0} XAF</Text>
    )}
  </View>
)

// Reusable Payment Item Component
const PaymentItem = ({ code, intitule, montant, annee, date }) => (
  <View style={styles.paymentCard}>
    <View style={styles.paymentIcon}>
      <FontAwesome name="money" size={24} color={colors.VERT} />
    </View>
    <View style={styles.paymentDetails}>
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentCode}>{code}</Text>
        <Text style={styles.paymentAmount}>{montant} XAF</Text>
      </View>
      <Text style={styles.paymentTitle}>{intitule}</Text>
      <Text style={styles.paymentYear}>{annee}</Text>
      <Text style={styles.paymentDate}>Payé le {dateParser(date)}</Text>
    </View>
  </View>
)

// Loading Skeleton for Payments
const PaymentsSkeleton = () => (
  <>
    {[1, 2, 3].map((_, i) => (
      <View key={i} style={styles.paymentCard}>
        <View style={styles.paymentIcon}>
          <Skeleton colorMode="light" width={24} height={24} radius="round" />
        </View>
        <View style={styles.paymentDetails}>
          <View style={styles.paymentHeader}>
            <Skeleton colorMode="light" width={100} height={16} />
            <Skeleton colorMode="light" width={80} height={16} />
          </View>
          <Skeleton colorMode="light" width={150} height={14} />
          <Skeleton colorMode="light" width={120} height={14} />
          <Skeleton colorMode="light" width={180} height={14} />
        </View>
      </View>
    ))}
  </>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLANC,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRIS_CLAIR,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Regular',
    marginLeft: 5,
    color: colors.NOIR,
  },
  titleHeader: {
    fontSize: 25,
    fontFamily: 'SemiBold',
    color: colors.NOIR,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: colors.VERT,
    marginTop: 15,
  },
  profileContent: {
    flexDirection: 'column',
  },
  studentName: {
    color: colors.BLANC,
    fontSize: 20,
    fontFamily: 'SemiBold',
    marginBottom: 10,
  },
  matriculeBadge: {
    backgroundColor: colors.BLANC,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  matriculeText: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.NOIR,
    textAlign: 'center',
  },
  studentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: colors.BLANC,
    fontSize:20,
    fontFamily: 'Regular',
    marginLeft: 5,
  },
  section: {
    marginBottom: 20,
  },
  feesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  feeCard: {
    width: '48%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  feeTitle: {
    fontSize: 20,
    fontFamily: 'SemiBold',
    marginBottom: 10,
  },
  amountBadge: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  amountText: {
    color: colors.BLANC,
    fontSize: 16,
    fontFamily: 'SemiBold',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryCard: {
    width: '30%',
    backgroundColor: colors.GRIS_TRES_CLAIR,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Regular',
    color: colors.GRIS_FONCE,
    marginVertical: 5,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 16,
    fontFamily: 'SemiBold',
    color: colors.NOIR,
    textAlign: 'center',
  },
  paymentCard: {
    backgroundColor: colors.BLANC,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.GRIS_CLAIR,
  },
  paymentIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  paymentCode: {
    fontSize: 16,
    fontFamily: 'Bold',
    color: colors.NOIR,
  },
  paymentAmount: {
    fontSize: 16,
    fontFamily: 'Bold',
    color: colors.VERT,
  },
  paymentTitle: {
    fontSize: 20,
    fontFamily: 'Regular',
    color: colors.NOIR,
    marginBottom: 3,
  },
  paymentYear: {
    fontSize: 13,
    fontFamily: 'Regular',
    color: colors.GRIS_FONCE,
    marginBottom: 3,
  },
  paymentDate: {
    fontSize: 13,
    fontFamily: 'Regular',
    color: colors.GRIS_FONCE,
  },
})

export default ModalStudent