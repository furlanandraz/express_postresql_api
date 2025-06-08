ALTER TABLE presentation.route_template_class
ADD CONSTRAINT chk_order_increment_is_valid
CHECK (
    template_order > 0
);
