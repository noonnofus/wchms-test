import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface MathContent {
    question: string;
    answer: string;
}

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 14, lineHeight: 1.5 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    instruction: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10, textAlign: "center" },
    instructionRed: { fontSize: 18, color: 'red', fontWeight: "bold", marginTop: 10, marginBottom: 10, textAlign: "center" },
    content: { fontSize: 20, textAlign: "justify" },
    contentRed: { fontSize: 20, textAlign: "justify", color: "red" },
    divider: { marginVertical: 10, borderBottomWidth: 0.5, borderBottomColor: "#000" },
});

const PDFMath = ({ title, difficulty, contents }: { title: string, difficulty: string, contents: MathContent[] }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>{difficulty} Calculation {title}</Text>
            <View style={styles.divider} />
            <Text style={styles.instruction}>
                【Think about it in heads and calculate it.】
            </Text>
            <View style={styles.divider} />
            {contents.map((content, i) => (
                <Text key={i} style={styles.content}>
                    {i + 1}. {content.question} = ?
                </Text>
            ))}
        </Page>
        <Page style={styles.page}>
            <Text style={styles.title}>{difficulty} Calculation {title}</Text>
            <View style={styles.divider} />
            <Text style={styles.instruction}>
                【Answer】
            </Text>
            <View style={styles.divider} />
            {contents.map((content, i) => (
                <Text key={i} style={styles.content}>
                    {i + 1}. {content.question} =
                    <Text key={i} style={styles.contentRed}>
                        {content.answer}
                    </Text>
                </Text>
            ))}
        </Page>
    </Document>
);

export default PDFMath;