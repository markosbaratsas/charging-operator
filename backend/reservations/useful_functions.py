from datetime import datetime

def validate_dates(dt, given_format):
    """Function used to validate that dates have the expected format

    Args:
        dt (str): String to be validated

    Returns:
        bool: True if in expected format, else False
    """
    try:
        datetime.strptime(dt, given_format)
    except:
        return False
    
    return True
