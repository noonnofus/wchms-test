import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 14, lineHeight: 1.5 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    instruction: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10, textAlign: "center" },
    instructionRed: { fontSize: 18, color: 'red', fontWeight: "bold", marginTop: 10, marginBottom: 10, textAlign: "center" },
    content: { fontSize: 18, textAlign: "justify" },
    divider: { marginVertical: 10, borderBottomWidth: 0.5, borderBottomColor: "#000" },
});

const PDFDocument = ({ title, content }: { title: string, content: string }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.divider} />
            <Text style={styles.instruction}>
                【Please
                <Text style={styles.instructionRed}> read it out loud twice </Text>
                as soon as possible】
            </Text>
            <View style={styles.divider} />
            <Text style={styles.content}>{content}</Text>
        </Page>
    </Document>
);

export default PDFDocument;