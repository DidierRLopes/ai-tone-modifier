"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { modifyText } from "../actions";

type Feature = {
	name: string;
	value: number;
};

export function ToneModifier() {
	const [prompt, setPrompt] = useState("");
	const [result, setResult] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [features, setFeatures] = useState<Feature[]>([
		{ name: "Clarity", value: 90 },
		{ name: "Simplicity", value: 40 },
		{ name: "Friendliness", value: 100 },
		{ name: "Helpfulness", value: 70 },
	]);
	const [apiKey, setApiKey] = useState("");
	const [newFeatureName, setNewFeatureName] = useState("");

	const handleFeatureChange = (index: number, newValue: number[]) => {
		setFeatures((prev) =>
			prev.map((feature, i) =>
				i === index ? { ...feature, value: newValue[0] } : feature,
			),
		);
	};

	const handleFeatureNameChange = (index: number, newName: string) => {
		setFeatures((prev) =>
			prev.map((feature, i) =>
				i === index ? { ...feature, name: newName } : feature,
			),
		);
	};

	const addNewFeature = () => {
		if (newFeatureName.trim()) {
			setFeatures((prev) => [...prev, { name: newFeatureName, value: 50 }]);
			setNewFeatureName("");
		}
	};

	const removeFeature = (index: number) => {
		setFeatures((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const result = await modifyText(prompt, features, apiKey);
			setResult(result || "No result returned from the API.");
		} catch (error) {
			console.error("Error:", error);
			setError(
				error instanceof Error ? error.message : "An unknown error occurred",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6 min-h-screen">
			<Card className="shadow-lg">
				<CardHeader className="space-y-2 pb-6">
					<CardTitle className="text-4xl font-display text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
						AI Tone Modifier
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-8">
					{/* API Key Input */}
					<div className="space-y-3">
						<Label htmlFor="api-key" className="text-lg font-medium">
							OpenAI API Key
						</Label>
						<Input
							id="api-key"
							type="password"
							placeholder="Enter your OpenAI API key"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							className="w-full transition-all focus:ring-2 focus:ring-primary/20"
						/>
					</div>

					{/* Custom Features */}
					<div className="space-y-6">
						<h3 className="text-xl font-medium">Custom Features</h3>
						<div className="space-y-4 rounded-lg bg-secondary/50 p-4">
							{features.map((feature, index) => (
								<div key={index} className="flex items-center gap-4">
									<Input
										value={feature.name}
										onChange={(e) =>
											handleFeatureNameChange(index, e.target.value)
										}
										className="w-1/3 transition-all focus:ring-2 focus:ring-primary/20"
										placeholder="Feature name"
									/>
									<Slider
										value={[feature.value]}
										onValueChange={(value) => handleFeatureChange(index, value)}
										max={100}
										step={1}
										className="w-1/3"
									/>
									<div className="w-16 text-sm font-medium">
										{feature.value}%
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeFeature(index)}
										className="hover:bg-destructive/10 hover:text-destructive transition-colors"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
							<div className="flex items-center gap-4 pt-2">
								<Input
									value={newFeatureName}
									onChange={(e) => setNewFeatureName(e.target.value)}
									placeholder="New feature name"
									className="w-2/3 transition-all focus:ring-2 focus:ring-primary/20"
								/>
								<Button
									onClick={addNewFeature}
									className="bg-primary/90 hover:bg-primary transition-colors"
								>
									Add Feature
								</Button>
							</div>
						</div>
					</div>

					{/* Input */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<Textarea
							placeholder="Enter your text here..."
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							className="min-h-[150px] transition-all focus:ring-2 focus:ring-primary/20"
						/>
						<Button
							type="submit"
							className="w-full bg-primary/90 hover:bg-primary transition-colors text-lg py-6"
							disabled={
								loading ||
								!prompt.trim() ||
								!apiKey.trim() ||
								features.length === 0
							}
						>
							{loading ? "Modifying..." : "Modify Text"}
						</Button>
					</form>

					{/* Error Display */}
					{error && (
						<Alert
							variant="destructive"
							className="animate-in slide-in-from-top"
						>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* Result */}
					{result && (
						<div className="space-y-4 animate-in fade-in-50">
							<h3 className="text-xl font-medium">Modified Text:</h3>
							<div className="p-6 rounded-lg bg-secondary/50 border border-border/50">
								{result}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
