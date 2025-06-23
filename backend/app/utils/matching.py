def skill_match_score(user_skills, required_skills):
    if not required_skills:
        return 0
    user_set = set([s.lower() for s in user_skills if s])
    req_set = set([s.lower() for s in required_skills if s])
    overlap = user_set & req_set
    return len(overlap) / len(req_set) if req_set else 0