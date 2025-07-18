#!/usr/bin/env python3
"""
Advanced spaCy NLP Service for Financial Sentiment Analysis
Integrates spaCy's industrial-strength NLP with financial domain expertise
"""

import sys
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

# Try to load spaCy model, use fallback if not available
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    SPACY_AVAILABLE = True
except (OSError, ImportError, ModuleNotFoundError):
    try:
        import spacy
        nlp = None
        SPACY_AVAILABLE = False
    except ImportError:
        spacy = None
        nlp = None
        SPACY_AVAILABLE = False

class SpacyFinancialNLP:
    def __init__(self):
        self.nlp = nlp
        
        # Financial domain lexicons with sentiment weights
        self.financial_positive = {
            'bull', 'bullish', 'gains', 'profit', 'surge', 'rally', 'breakout', 
            'momentum', 'uptrend', 'strength', 'outperform', 'beat', 'exceed', 
            'strong', 'robust', 'growth', 'improve', 'increase', 'rise', 'boost',
            'enhance', 'optimize', 'upgrade', 'advance', 'progress', 'confident',
            'stable', 'secure', 'reliable', 'solid', 'promising', 'encouraging',
            'optimistic', 'hopeful', 'successful', 'profitable', 'excellent'
        }
        
        self.financial_negative = {
            'bear', 'bearish', 'loss', 'losses', 'decline', 'crash', 'plunge',
            'drop', 'fall', 'downtrend', 'weakness', 'underperform', 'miss',
            'fail', 'weak', 'fragile', 'recession', 'crisis', 'bubble', 'risk',
            'volatile', 'uncertainty', 'concern', 'worry', 'fear', 'panic',
            'correction', 'selloff', 'dump', 'collapse', 'bankruptcy', 'debt'
        }
        
        # Market entities and their typical sentiment context
        self.market_entities = {
            'stocks', 'shares', 'equity', 'bonds', 'futures', 'options',
            'cryptocurrency', 'bitcoin', 'ethereum', 'forex', 'commodities',
            'portfolio', 'investment', 'trading', 'market', 'exchange'
        }

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Comprehensive NLP analysis using spaCy with financial domain expertise
        """
        if not text or len(text.strip()) == 0:
            return self._get_default_result()
        
        # Check if spaCy is available
        if not SPACY_AVAILABLE or self.nlp is None:
            return self._get_fallback_analysis(text)
        
        # Process text with spaCy
        doc = self.nlp(text)
        
        # Extract linguistic features
        entities = self._extract_entities(doc)
        sentiment_features = self._analyze_sentiment_features(doc)
        linguistic_features = self._extract_linguistic_features(doc)
        financial_context = self._analyze_financial_context(doc)
        
        # Calculate composite sentiment score
        sentiment_score = self._calculate_sentiment_score(
            sentiment_features, financial_context, linguistic_features
        )
        
        return {
            "status": "success",
            "model": "spacy_financial_nlp",
            "analysis": {
                "sentiment_score": sentiment_score,
                "sentiment_label": self._get_sentiment_label(sentiment_score),
                "confidence": sentiment_features["confidence"],
                "entities": entities,
                "financial_context": financial_context,
                "linguistic_features": linguistic_features,
                "sentiment_features": sentiment_features
            },
            "metadata": {
                "text_length": len(text),
                "processed_tokens": len(doc),
                "timestamp": datetime.now().isoformat(),
                "model_version": spacy.__version__
            }
        }

    def _extract_entities(self, doc) -> Dict[str, List[str]]:
        """Extract and categorize named entities"""
        entities = {
            "organizations": [],
            "persons": [],
            "money": [],
            "dates": [],
            "locations": [],
            "financial_instruments": []
        }
        
        for ent in doc.ents:
            if ent.label_ in ["ORG", "CORP"]:
                entities["organizations"].append(ent.text)
            elif ent.label_ == "PERSON":
                entities["persons"].append(ent.text)
            elif ent.label_ == "MONEY":
                entities["money"].append(ent.text)
            elif ent.label_ in ["DATE", "TIME"]:
                entities["dates"].append(ent.text)
            elif ent.label_ in ["GPE", "LOC"]:
                entities["locations"].append(ent.text)
        
        # Identify financial instruments
        for token in doc:
            if token.text.lower() in self.market_entities:
                entities["financial_instruments"].append(token.text)
        
        return entities

    def _analyze_sentiment_features(self, doc) -> Dict[str, Any]:
        """Analyze sentiment-related features"""
        positive_count = 0
        negative_count = 0
        neutral_count = 0
        intensity_modifiers = 0
        negations = 0
        
        positive_words = []
        negative_words = []
        
        for token in doc:
            token_lower = token.text.lower()
            
            # Count negations
            if token.dep_ == "neg" or token_lower in ["not", "no", "never", "nothing", "none"]:
                negations += 1
            
            # Count intensity modifiers
            if token_lower in ["very", "extremely", "highly", "significantly", "substantially"]:
                intensity_modifiers += 1
            
            # Financial sentiment analysis
            if token_lower in self.financial_positive:
                positive_count += 1
                positive_words.append(token.text)
            elif token_lower in self.financial_negative:
                negative_count += 1
                negative_words.append(token.text)
            else:
                neutral_count += 1
        
        total_sentiment_words = positive_count + negative_count
        confidence = min(total_sentiment_words / max(len(doc), 1) * 2, 1.0)
        
        return {
            "positive_count": positive_count,
            "negative_count": negative_count,
            "neutral_count": neutral_count,
            "positive_words": positive_words,
            "negative_words": negative_words,
            "intensity_modifiers": intensity_modifiers,
            "negations": negations,
            "confidence": confidence
        }

    def _extract_linguistic_features(self, doc) -> Dict[str, Any]:
        """Extract linguistic and structural features"""
        features = {
            "sentence_count": len(list(doc.sents)),
            "avg_sentence_length": 0,
            "question_count": 0,
            "exclamation_count": 0,
            "capitalized_words": 0,
            "pos_distribution": {},
            "dependency_features": {}
        }
        
        # Calculate average sentence length
        sentences = list(doc.sents)
        if sentences:
            features["avg_sentence_length"] = sum(len(sent) for sent in sentences) / len(sentences)
        
        # Count punctuation patterns
        for token in doc:
            if token.text == "?":
                features["question_count"] += 1
            elif token.text == "!":
                features["exclamation_count"] += 1
            elif token.text.isupper() and len(token.text) > 1:
                features["capitalized_words"] += 1
        
        # POS tag distribution
        pos_counts = {}
        for token in doc:
            pos = token.pos_
            pos_counts[pos] = pos_counts.get(pos, 0) + 1
        
        features["pos_distribution"] = pos_counts
        
        return features

    def _analyze_financial_context(self, doc) -> Dict[str, Any]:
        """Analyze financial domain-specific context"""
        context = {
            "financial_entities_count": 0,
            "market_direction_indicators": [],
            "risk_indicators": [],
            "performance_indicators": [],
            "temporal_indicators": []
        }
        
        # Market direction indicators
        direction_up = {"up", "rise", "gain", "increase", "surge", "rally", "bull", "growth"}
        direction_down = {"down", "fall", "drop", "decline", "crash", "bear", "loss", "plunge"}
        
        # Risk indicators
        risk_words = {"risk", "volatile", "uncertainty", "crisis", "bubble", "correction"}
        
        # Performance indicators
        performance_words = {"earnings", "revenue", "profit", "margin", "yield", "return", "dividend"}
        
        for token in doc:
            token_lower = token.text.lower()
            
            if token_lower in self.market_entities:
                context["financial_entities_count"] += 1
            
            if token_lower in direction_up:
                context["market_direction_indicators"].append(("positive", token.text))
            elif token_lower in direction_down:
                context["market_direction_indicators"].append(("negative", token.text))
            
            if token_lower in risk_words:
                context["risk_indicators"].append(token.text)
            
            if token_lower in performance_words:
                context["performance_indicators"].append(token.text)
        
        return context

    def _calculate_sentiment_score(self, sentiment_features: Dict, financial_context: Dict, linguistic_features: Dict) -> float:
        """Calculate composite sentiment score (0-100 scale)"""
        # Base sentiment from word counts
        positive_score = sentiment_features["positive_count"] * 10
        negative_score = sentiment_features["negative_count"] * 10
        
        # Apply financial context weights
        direction_score = 0
        for direction, word in financial_context["market_direction_indicators"]:
            if direction == "positive":
                direction_score += 5
            else:
                direction_score -= 5
        
        # Risk adjustment
        risk_penalty = len(financial_context["risk_indicators"]) * 3
        
        # Negation adjustment
        if sentiment_features["negations"] > 0:
            # Flip sentiment if negations present
            positive_score, negative_score = negative_score, positive_score
        
        # Calculate final score
        raw_score = positive_score - negative_score + direction_score - risk_penalty
        
        # Normalize to 0-100 scale
        normalized_score = max(0, min(100, 50 + raw_score))
        
        return round(normalized_score, 2)

    def _get_sentiment_label(self, score: float) -> str:
        """Convert numeric score to sentiment label"""
        if score >= 65:
            return "positive"
        elif score <= 35:
            return "negative"
        else:
            return "neutral"

    def _get_default_result(self) -> Dict[str, Any]:
        """Return default result for empty input"""
        return {
            "status": "success",
            "model": "spacy_financial_nlp",
            "analysis": {
                "sentiment_score": 50.0,
                "sentiment_label": "neutral",
                "confidence": 0.0,
                "entities": {},
                "financial_context": {},
                "linguistic_features": {},
                "sentiment_features": {}
            },
            "metadata": {
                "text_length": 0,
                "processed_tokens": 0,
                "timestamp": datetime.now().isoformat(),
                "model_version": "fallback"
            }
        }

    def _get_fallback_analysis(self, text: str) -> Dict[str, Any]:
        """Provide fallback analysis when spaCy is not available"""
        words = text.lower().split()
        
        # Simple sentiment analysis using financial lexicons
        positive_count = sum(1 for word in words if word in self.financial_positive)
        negative_count = sum(1 for word in words if word in self.financial_negative)
        
        # Calculate basic sentiment score
        sentiment_diff = positive_count - negative_count
        sentiment_score = max(0, min(100, 50 + sentiment_diff * 10))
        
        return {
            "status": "success",
            "model": "spacy_financial_nlp_fallback",
            "analysis": {
                "sentiment_score": round(sentiment_score, 2),
                "sentiment_label": self._get_sentiment_label(sentiment_score),
                "confidence": min(0.8, (positive_count + negative_count) / max(len(words), 1)),
                "entities": {
                    "organizations": [],
                    "persons": [],
                    "money": [],
                    "dates": [],
                    "locations": [],
                    "financial_instruments": [word for word in words if word in self.market_entities]
                },
                "financial_context": {
                    "financial_entities_count": len([w for w in words if w in self.market_entities]),
                    "market_direction_indicators": [],
                    "risk_indicators": [word for word in words if word in {"risk", "volatile", "crisis"}],
                    "performance_indicators": [word for word in words if word in {"earnings", "profit", "revenue"}],
                    "temporal_indicators": []
                },
                "linguistic_features": {
                    "sentence_count": text.count('.') + text.count('!') + text.count('?') + 1,
                    "avg_sentence_length": len(words),
                    "question_count": text.count('?'),
                    "exclamation_count": text.count('!'),
                    "capitalized_words": len([w for w in text.split() if w.isupper()]),
                    "pos_distribution": {},
                    "dependency_features": {}
                },
                "sentiment_features": {
                    "positive_count": positive_count,
                    "negative_count": negative_count,
                    "neutral_count": len(words) - positive_count - negative_count,
                    "positive_words": [w for w in words if w in self.financial_positive],
                    "negative_words": [w for w in words if w in self.financial_negative],
                    "intensity_modifiers": len([w for w in words if w in ["very", "extremely", "highly"]]),
                    "negations": len([w for w in words if w in ["not", "no", "never"]]),
                    "confidence": min(0.8, (positive_count + negative_count) / max(len(words), 1))
                }
            },
            "metadata": {
                "text_length": len(text),
                "processed_tokens": len(words),
                "timestamp": datetime.now().isoformat(),
                "model_version": "fallback_lexicon_v1.0",
                "note": "Using fallback analysis - spaCy model not available"
            }
        }

def analyze_sentiment(text: str):
    """Main function for sentiment analysis"""
    analyzer = SpacyFinancialNLP()
    result = analyzer.analyze_text(text)
    print(json.dumps(result))

def batch_analyze(texts: List[str]):
    """Batch analysis for multiple texts"""
    analyzer = SpacyFinancialNLP()
    results = []
    
    for text in texts:
        result = analyzer.analyze_text(text)
        results.append(result)
    
    print(json.dumps({
        "status": "success",
        "model": "spacy_financial_nlp_batch",
        "results": results,
        "count": len(results),
        "timestamp": datetime.now().isoformat()
    }))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "error",
            "error": "missing_argument", 
            "message": "Please provide text to analyze"
        }))
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "analyze":
        if len(sys.argv) < 3:
            print(json.dumps({
                "status": "error",
                "error": "missing_text",
                "message": "Please provide text to analyze"
            }))
            sys.exit(1)
        text = sys.argv[2]
        analyze_sentiment(text)
    
    elif command == "batch":
        if len(sys.argv) < 3:
            print(json.dumps({
                "status": "error", 
                "error": "missing_texts",
                "message": "Please provide texts for batch analysis"
            }))
            sys.exit(1)
        
        try:
            texts = json.loads(sys.argv[2])
            batch_analyze(texts)
        except json.JSONDecodeError:
            print(json.dumps({
                "status": "error",
                "error": "invalid_json",
                "message": "Invalid JSON format for batch texts"
            }))
            sys.exit(1)
    
    else:
        print(json.dumps({
            "status": "error",
            "error": "invalid_command",
            "message": "Available commands: analyze, batch"
        }))
        sys.exit(1)