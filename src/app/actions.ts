"use server";

import OpenAI from "openai";

type Feature = {
	name: string;
	value: number;
};

export async function modifyText(
	text: string,
	features: Feature[],
	apiKey: string,
): Promise<string> {
	const openai = new OpenAI({ apiKey });

	try {
		const featureString = features
			.map((f) => `${f.name}: ${f.value}%`)
			.join(", ");

		const prompt = `Please modify the following text according to these characteristics: ${featureString}. 
                       Text to modify: "${text}"
                       Please return only the modified text without any explanations.`;

		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.7,
		});

		return response.choices[0]?.message?.content || "No response generated";
	} catch (error) {
		console.error("OpenAI API Error:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to modify text",
		);
	}
}
